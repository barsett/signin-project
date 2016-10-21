/*
  this is a fork modified implementation of redux-auth-wrapper. The reason not using the master branch are the following
  - do not know how to do redirect when using react-native-router-flux 2.x
  - due to nature of rnrf 2.x and nagivatorreducer, componentWillReceiveProps will be called infinitely
    therefore need to comment ensureAuth in componentWillReceiveProps

*/
import React, { PropTypes, Component } from 'react';
import {
    View
} from 'react-native';
import {
    connect
} from 'react-redux'
import hoistStatics from 'hoist-non-react-statics'
//import isEmpty from 'lodash.isempty'
import {
  Actions,
} from 'react-native-router-flux';

const defaults = {
    failureRedirectPath: 'splash',
    wrapperDisplayName: 'AuthWrapper',
    predicate: x => x,
    allowRedirectBack: true
}

function factory(React, empty) {

    // const {
    //     Component,
    //     PropTypes
    // } = React;

    return (args) => {
        const {
            authSelector,
            failureRedirectPath,
            wrapperDisplayName,
            predicate,
            allowRedirectBack,
            redirectAction
        } = {
            ...defaults,
            ...args
        }

        const isAuthorized = (authData) => {
            //console.log("predicate", predicate);
            return predicate(authData);
        }

        const ensureAuth = ({
            location,
            authData
        }, redirect) => {
            //console.log("ensureAuth", authData)
            //console.log("ensureAuth")

            let query
            if (allowRedirectBack) {
                query = {
                    redirect: `${location.pathname}${location.search}`
                }
            } else {
                query = {}
            }

            if (!isAuthorized(authData)) {
                console.log("not authorized")
                redirect({
                    pathname: failureRedirectPath,
                    query
                })
                console.log("token is removed")

                Actions[failureRedirectPath]({logout: true});
            }
        }

        // Wraps the component that needs the auth enforcement
        function wrapComponent(DecoratedComponent) {
            const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'

            const mapDispatchToProps = (dispatch) => {
                //console.log("mapDispatchToProps", redirectAction);
                if (redirectAction !== undefined) {
                    return {
                        redirect: (args) => dispatch(redirectAction(args))
                    }
                } else {
                    return {}
                }
            }

            const mapStateToProps = (state, ownProps) => {
                return {
                    authData: authSelector(state, ownProps, false)
                }
            }

            class UserAuthWrapper extends Component {

                static displayName = `${wrapperDisplayName}(${displayName})`;

                // static propTypes = {
                //   location: PropTypes.shape({
                //     pathname: PropTypes.string.isRequired,
                //     search: PropTypes.string.isRequired
                //   }).isRequired,
                //   redirect: PropTypes.func,
                //   authData: PropTypes.object
                // };

                static contextTypes = {
                    // Only used if no redirectAction specified
                    router: React.PropTypes.object
                };

                componentWillMount() {
                    //console.log("componentWillMount")
                    ensureAuth(this.props, this.getRedirectFunc(this.props))
                }

                componentWillReceiveProps(nextProps) {
                    //console.log("componentWillReceiveProps")

                    //disabled since it cause infinite loop. this method is called BEFORE_ROUTE
                    //ensureAuth(nextProps, this.getRedirectFunc(nextProps))
                }

                getRedirectFunc = (props) => {
                    //console.log("getRedirectFunc");


                    if (props.redirect) {
                        return props.redirect
                    } else {
                        if (!this.context.router.replace) {
                            /* istanbul ignore next sanity */
                            throw new Error(`You must provide a router context (or use React-Router 2.x) if not passing a redirectAction to ${wrapperDisplayName}`)
                        } else {
                            return this.context.router.replace
                        }
                    }
                };

                render() {
                    //console.log("render()")

                    // Allow everything but the replace aciton creator to be passed down
                    // Includes route props from React-Router and authData
                    const {
                        redirect,
                        authData,
                        ...otherProps
                    } = this.props

                    if (isAuthorized(authData)) {
                        //console.log("request is authorized");
                        return <DecoratedComponent authData = {
                            authData
                        } {...otherProps
                        }
                        />
                    } else {
                        // Don't need to display anything because the user will be redirected
                        return React.createElement(empty);
                    }
                }
            }

            //return a wrapped component with redut connect
            return connect(mapStateToProps, mapDispatchToProps) (hoistStatics(UserAuthWrapper, DecoratedComponent))
        }

        wrapComponent.onEnter = (store, nextState, replace) => {
            const authData = authSelector(store.getState(), null, true)
            ensureAuth({
                location: nextState.location,
                authData
            }, replace)
        }

        return wrapComponent
    }
}

export const UserAuthWrapper = factory(React, View);
