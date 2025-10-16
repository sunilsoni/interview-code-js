import React from "react";

// Update Page and UserInfoWithTitle
function Page({ user }) {
    return (
        <div data-testid="page">
            <div>...</div>
            <UserInfoWithTitle title="User Info" user={user} />
            <div>...</div>
        </div>
    );
}

function UserInfoWithTitle({ title, user }) {
    return (
        <div data-testid="uiwt">
            <div>{title}</div>
            <UserInfo user={user} />
        </div>
    );
}

// Do not change the UserInfo component
function UserInfo({ user }) {
    return (
        <div data-testid="userinfo">
            <span>{user.firstName}</span>
            <span>{user.lastName}</span>
        </div>
    );
}

// Modify preview if needed (not evaluated)
export function Preview() {
    return (
        <Page user={{ firstName: "John", lastName: "Doe" }} />
    );
}

// Do not change
export {
    Page,
    UserInfoWithTitle,
    UserInfo
}