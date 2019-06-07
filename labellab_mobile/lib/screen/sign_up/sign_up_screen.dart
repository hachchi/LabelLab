import 'package:flutter/material.dart';
import 'package:labellab_mobile/model/register_user.dart';
import 'package:labellab_mobile/model/user.dart';
import 'package:labellab_mobile/routing/application.dart';
import 'package:labellab_mobile/state/auth_state.dart';
import 'package:labellab_mobile/widgets/label_text_field.dart';
import 'package:provider/provider.dart';

class SignUpScreen extends StatefulWidget {
  SignUpScreen({Key key}) : super(key: key);

  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  GlobalKey<FormState> _key = GlobalKey();

  RegisterUser _user = RegisterUser.just();
  bool _isRegistering = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(""),
        elevation: 0,
        backgroundColor: Theme.of(context).canvasColor,
      ),
      body: Theme(
        data: Theme.of(context)
            .copyWith(primaryColor: Theme.of(context).accentColor),
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.only(left: 16.0, right: 16, top: 54),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Text(
                  "Sign Up",
                  style: Theme.of(context).textTheme.headline,
                ),
                Form(
                  key: _key,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Username",
                        onSaved: (String value) {
                          _user.username = value;
                        },
                        validator: _validateUsername,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Name",
                        textCapitalization: TextCapitalization.words,
                        onSaved: (String value) {
                          _user.name = value;
                        },
                        validator: _validateName,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Email",
                        onSaved: (String value) {
                          _user.email = value;
                        },
                        validator: _validateEmail,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Password",
                        isObscure: true,
                        onSaved: (String value) {
                          _user.password = value;
                        },
                        validator: _validatePassword,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      LabelTextField(
                        labelText: "Confirm Password",
                        isObscure: true,
                        onSaved: (String value) {
                          _user.password2 = value;
                        },
                        validator: _validateConfirmPassword,
                      ),
                      SizedBox(
                        height: 16,
                      ),
                      RaisedButton(
                        elevation: 0,
                        color: Theme.of(context).accentColor,
                        colorBrightness: Brightness.dark,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: EdgeInsets.symmetric(vertical: 16.0),
                        child: _isRegistering
                            ? Text("Signnig Up")
                            : Text("Sign Up"),
                        onPressed: _isRegistering ? null : _onSubmit,
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  height: 16,
                ),
                FlatButton(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                  child: Text("Already have an account?"),
                  onPressed: _onSignIn,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _validateUsername(String username) {
    if (username.isEmpty) {
      return "Username can't be empty";
    }
    return null;
  }

  String _validateName(String username) {
    if (username.isEmpty) {
      return "Name can't be empty";
    }
    return null;
  }

  String _validateEmail(String username) {
    if (username.isEmpty) {
      return "Email can't be empty";
    }
    return null;
  }

  String _validatePassword(String password) {
    if (password.isEmpty) {
      return "Password can't be empty";
    }
    return null;
  }

  String _validateConfirmPassword(String password) {
    if (password.isEmpty || _user.password != _user.password2) {
      return "Passwords doesn't match";
    }
    return null;
  }

  void _onSubmit() {
    _key.currentState.save();
    if (_key.currentState.validate()) {
      setState(() {
        _isRegistering = true;
      });
      Provider.of<AuthState>(context).register(_user).then((success) {
        if (success) {
          Application.router
              .navigateTo(context, "/", replace: true, clearStack: true);
        } else {
          setState(() {
            _isRegistering = false;
          });
        }
      }).catchError((err) {
        setState(() {
          _isRegistering = false;
        });
        print(err.toString());
        // Scaffold.of(context).showSnackBar(SnackBar(
        //   content: Text("Sign in failed!"),
        // ));
      });
    }
  }

  void _onSignIn() {
    Application.router.pop(context);
  }
}