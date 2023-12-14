import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, authUser, stripePromise, ...rest }: any) {
    return (
        <Route
            {...rest}
            render={props =>
                authUser ? (
                    <Component {...props} stripePromise={stripePromise} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/signin",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute