type UserListProps = {
    userList: string[];
    user: string;
};

export const UserList = ({ userList, user }: UserListProps) => {
    return (   
        <div className="user-list">
            <h3>Online Users ({userList.length})</h3>
            <ul>
                {userList && userList.map((userItem) => (
                    <li className={`${user === userItem ? 'self' : ''}`} key={userItem}>{userItem }</li>
                ))}
            </ul>
        </div>
    )
}