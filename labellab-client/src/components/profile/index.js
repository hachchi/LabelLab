import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Card,
  Image,
  Label,
  Container,
  Menu,
  Dimmer,
  Loader,
  Dropdown,
  Button,
  Grid
} from 'semantic-ui-react'
import Navbar from '../navbar/project'
import {
  fetchUser,
  uploadImage,
  fetchAllProject,
  fetchCount
} from '../../actions/index'
import { hasToken } from '../../utils/token'
import { TOKEN_TYPE } from '../../constants/index'
import CardLoader from '../../utils/cardLoader'
import ProfileCard from './profile-card'
import './css/profile.css'
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: '',
      image: ''
    }
  }
  componentDidMount() {
    const { history, fetchUser, fetchAllProject, fetchCount } = this.props
    if (hasToken(TOKEN_TYPE)) {
      fetchUser()
      fetchAllProject()
      fetchCount()
    } else {
      history.push('/login')
    }
  }
  handleImageChange = e => {
    e.preventDefault()
    let reader = new FileReader()
    let file = e.target.files[0]
    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        file: file
      })
      this.onSubmit()
    }
    reader.readAsDataURL(file)
  }
  handleRemoveImage = () => {
    this.setState({
      image: null,
      file: null
    })
    this.onSubmit()
  }
  onSubmit = () => {
    const { uploadImage } = this.props
    let { file, image } = this.state
    if (!file && !image) {
      let data = {
        image: null,
        format: null
      }
      uploadImage(data, this.imageCallback)
    } else if (file && file.size > 101200) {
      this.setState({
        max_size_error: 'max sized reached'
      })
    } else {
      let data = {
        image: image,
        format: file.type
      }
      uploadImage(data, this.imageCallback)
    }
  }
  handleClick = id => {
    this.props.history.push({
      pathname: '/project/' + id + '/team'
    })
  }
  imageCallback = () => {
    this.setState({
      image: null,
      file: null
    })
    this.props.fetchUser()
  }
  render() {
    const { user, history, isfetching, profile, actions, projects } = this.props
    return (
      <div>
        <Navbar title="Profile" history={history} />
        {!isfetching ? (
          <React.Fragment>
            <div className="container">
              <div className="profile">
                <ProfileCard />
              </div>
              <div className="content">ddd</div>
            </div>
            <div className="project-second">
              <div className="project-second-leftbar">
                <Menu vertical>
                  <Menu.Item as={Link} to="" name="projects">
                    Projects
                  </Menu.Item>
                  <Dropdown item text="Project Analytics">
                    <Dropdown.Menu>
                      {projects.map(project => (
                        <Dropdown.Item
                          key={project._id}
                          as={Link}
                          to={'/project/' + project._id + '/analytics'}
                        >
                          {project.projectName}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Menu.Item as={Link} to="" name="summary">
                    Summary
                  </Menu.Item>
                </Menu>
              </div>
              <div className="project-second-rightbar">
                <Card.Group itemsPerRow={3}>
                  {!actions.isfetching ? (
                    projects[0] &&
                    projects.map((project, index) => (
                      <Card
                        key={index}
                        onClick={() => this.handleClick(project._id)}
                      >
                        <Card.Content
                          className="card-headers"
                          header={project.projectName}
                        />
                        <Card.Content
                          description={project.projectDescription}
                        />
                        <Card.Content extra />
                      </Card>
                    ))
                  ) : (
                    <CardLoader />
                  )}
                </Card.Group>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <Dimmer active>
            <Loader indeterminate>Loading..</Loader>
          </Dimmer>
        )}
      </div>
    )
  }
}

Profile.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
  isfetching: PropTypes.bool,
  projects: PropTypes.array,
  actions: PropTypes.object,
  history: PropTypes.object,
  fetchAllProject: PropTypes.func,
  fetchCount: PropTypes.func,
  fetchUser: PropTypes.func,
  uploadImage: PropTypes.func
}

const mapStateToProps = state => {
  return {
    user: state.user.userDetails,
    profile: state.user.userProfile,
    isfetching: state.user.userActions.isfetching,
    projects: state.projects.allProjects,
    actions: state.projects.projectActions
  }
}

const mapActionToProps = dispatch => {
  return {
    fetchUser: () => {
      return dispatch(fetchUser())
    },
    fetchAllProject: () => {
      return dispatch(fetchAllProject())
    },
    fetchCount: () => {
      return dispatch(fetchCount())
    },
    uploadImage: (data, callback) => {
      return dispatch(uploadImage(data, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapActionToProps
)(Profile)

{
  /* <div className="profile-first-leftbar">
                <img
                  alt=""
                  src={
                    user.profileImage === ''
                      ? `${user.thumbnail}`
                      : `${user.profileImage}?${Date.now()}`
                  }
                  className="image"
                />
                <div className="profile-edit-button">
                  <input
                    type="file"
                    onChange={this.handleImageChange}
                    className="profile-file-input"
                    id="profile-embedpollfileinput"
                  />
                  <label
                    htmlFor="profile-embedpollfileinput"
                    className="ui medium primary left floated button custom-margin"
                  >
                    Edit
                  </label>
                  <Button
                    negative
                    icon="delete"
                    onClick={this.handleRemoveImage}
                  />
                </div>
                {this.state.max_size_error ? (
                  <div className="image_size_error">
                    Max size of the profile pic should be 101Kb
                  </div>
                ) : null}
              </div>
              <div className="profile-first-rightbar">
                <Grid columns={2}>
                  <Grid.Row>
                    <Grid.Column>
                      <Card className="project-card">
                        <Card.Header as="h2" className="project-card-header">
                          Project Information
                        </Card.Header>
                        <Card.Content>
                          <div className="project-details">
                            <div className="project-detail">
                              <Label color="white" size="big" image>
                                Total Projects
                                <Label.Detail>
                                  {profile.totalProjects}
                                </Label.Detail>
                              </Label>
                            </div>
                            <div className="project-detail">
                              <Label color="white" size="big" image>
                                Total Images
                                <Label.Detail>
                                  {profile.totalImages}
                                </Label.Detail>
                              </Label>
                            </div>
                            <div className="project-detail">
                              <Label color="white" size="big" image>
                                Total Labels
                                <Label.Detail>
                                  {profile.totalLabels}
                                </Label.Detail>
                              </Label>
                            </div>
                          </div>
                        </Card.Content>
                      </Card>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div> */
}
