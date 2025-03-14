type UserListProps = {
    userList: string[];
    user: string;
};

export const UserList = ({ userList, user }: UserListProps) => {
    return (   
        <div className="user-list">
            <h3>Online Users ({userList.length})</h3>
            <ul className="list-disc list-inside text-sm">
                {userList && userList.map((userItem) => (
                    <li className={`${user === userItem ? 'text-blue-800' : ''}`} key={userItem}>{userItem }</li>
                ))}
            </ul>
        </div>
    )
}