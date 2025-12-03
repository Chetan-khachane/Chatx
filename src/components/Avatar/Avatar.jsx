import Avatar from "boring-avatars";
import { useAuth } from "../../context/AuthContext";

export default function UseAvatar({
  styling,
  profileUrl,
  listEnabled = false,
  listOpener,
  notificationAvailable = false,
}) {
  const { userInfo } = useAuth();

  const handleClick =
    listEnabled && listOpener
      ? () =>
          listOpener((v) => {
            return !v;
          })
      : undefined;

  if (profileUrl !== "" && !listEnabled) {
    return (
      <img
        src={profileUrl}
        onClick={handleClick}
        alt="profile picture"
        className={`rounded-full object-cover  ${styling} ${
          handleClick ? "cursor-pointer" : ""
        }`}
      />
    );
  }

  if (profileUrl === "" && !listEnabled) {
    return (
      <div
        onClick={handleClick}
        className={handleClick ? "cursor-pointer" : ""}
      >
        <Avatar
          className={`${styling} rounded-full object-cover `}
          name={userInfo?.name || "User"}
          variant="beam"
          colors={["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"]}
        />
      </div>
    );
  }

  if (userInfo  && listEnabled)
    return (
      <div className="absolute right-2 top-2">
        {userInfo.profileUrl ? (
          <img
            src={userInfo.profileUrl}
            onClick={handleClick}
            alt="profile picture"
            className={`rounded-full object-cover ${styling} ${
              handleClick ? "cursor-pointer" : ""
            }`}
          />
        ) : (
          <Avatar
            className={`${styling} rounded-full object-cover `}
            name={userInfo?.name || "User"}
            onClick={handleClick}
            variant="beam"
            colors={["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"]}
          />
        )}
        {notificationAvailable && (
          <span
            className="
        absolute bottom-0 left-0 
        h-3 w-3 
        bg-red-500 
        border-2 border-white 
        rounded-full 
        animate-pulse
      "
          />
        )}
      </div>
    );
}
