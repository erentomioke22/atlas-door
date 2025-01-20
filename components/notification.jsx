import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";
import { FaMessage } from "react-icons/fa6";
import moment from "moment";
import { PiHeartFill } from "react-icons/pi";
import { FaUserGroup } from "react-icons/fa6";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {  toast } from "sonner";
import axios from "axios";
import ImageCom from "./ui/Image";



export default function Notification({ notification }) {
  const queryClient = useQueryClient();
  const queryKey = ["notifications"];
  const joinTeamUserMutate = useMutation({
    mutationKey: ["join-team"],
    mutationFn: ({ userId, teamId }) =>
      axios.post(`/api/team/teamName/${teamId}/members?userId=${userId}`),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey });
      toast.success("you join team successfully");
    },
    onError(error, variables, context) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to create team. Please try again.");
      }
    },
  });


  const notificationTypeMap = {
    FOLLOW: {
      message: (
        <>
          {" "}
          <span >followed</span> you
        </>
      ),
      icon: <FaUserPlus className="text-[14px]  " />,
      href: `/users/`,
    },
    COMMENT: {
      message: (
        <>
          <span >commented</span> on your post
        </>
      ),
      icon: <FaMessage className="text-[12px]  " />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: (
        <>
          <span>liked</span> your post
        </>
      ),
      icon: <PiHeartFill className="text-[14px]  " />,
      href: `/posts/${notification.postId}`,
    },
    POST: {
      message: (
        <>
          <span>Create</span> new post
        </>
      ),
      icon: <IoPencil className="text-[14px] " />,
      href: `/posts/${notification.postId}`,
    },
    TEAM: {
      message: (
        <>
          <span>Invite</span> you to join their Team
        </>
      ),
      icon: <FaUserGroup className="text-[14px] " />,
      href: `/team/${notification.teamId}`,
    },
  };
  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <div className={` py-5 px-3  `}>
      <div className="flex  justify-between gap-3">
        <div className="flex gap-2 ">

            <div className="relative flex h-9 w-9  rounded-lg">
  <div className="relative h-full w-full">
              <ImageCom
               className="rounded-lg h-full w-full"
               size={"rounded-lg h-full w-full"}
               src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
               }
               alt={'avatar'}
             />
    <div className={`${!notification.read && 'animate-pulse absolute inset-0 border-[3px] border-redorange rounded-lg' } `}></div>
  </div>
</div>

          <div>
            <div className="text-sm space-x-1 ">
              <p className=" text-[12px]">{notification?.name}</p>
              <p className=" text-[12px]">{notification?.email}</p>
              <span className="text-lfont text-[12px]">{message}</span>
            </div>
            <div className=" text-[10px] text-lfont">
        <p>{moment(new Date(notification.createdAt), "YYYYMMDD").fromNow()}</p>
      </div>
          </div>
        </div>

      </div>
      {notification.post && (
        <Link href={`/posts/${notification?.post.link}`}>
          <div className="text-sm bg-lcard bg-opacity-50 dark:bg-dcard p-2  rounded-xl mt-3">
            <div className="flex gap-2">
            <div className="w-7 h-7 relative">
                   <ImageCom src={`${process.env.NEXT_PUBLIC_BASE_URL}${notification.post.images[0]}`} className="rounded-lg w-7 h-7" size={'h-7 w-7 rounded-lg'} alt={"avatar"}/>
                  </div>
              <div className="flex flex-col ">
                <span className="text-sm  line-clamp-2">
                  {notification.post.title}
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}



    </div>
  );
}