import React from "react";
import auth from "../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import UserAddedVideo from "./UserAddedVideo/UserAddedVideo";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "../Shared/LoadingSpinner";

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  //user input form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  if (loading) {
    return <Loading></Loading>;
  }

  // get url
  function youtube_parser(url) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
  const onSubmit = async (data) => {
    const linkKey = youtube_parser(data.url);

    //getting embeded link from shared youtube link
    const embededLink = `https://www.youtube.com/embed/${linkKey}`;
    console.log(embededLink);

    //with this embeded link create a new video and post that new video data to db when user add one
    const video = {
      link: embededLink,
      likeCount: 0,
      dislikeCount: 0,
      viewCount: 0,
      userLiked: [],
      userDisliked: [],
      uploaderEmail: user.email,
    };
    fetch(
      "https://onnorokom-server-cyce.vercel.app/video-server/api/v1/video",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(video),
      }
    )
      .then((res) => res.json())
      .then((inserted) => {
        console.log(inserted);
        if (inserted.insertedId) {
          toast.success("Video Added successfully");
          console.log("video added");
        }
      });
  };

  //fetch the user data -from server

  //fetch video data - from server

  //fake data
  const videos = [
    {
      link: "https://www.youtube.com/embed/hZjkEf_w6go",
      likeCount: 20,
      dislikeCount: 10,
      viewCount: 30,
    },
    {
      link: "https://www.youtube.com/embed/kgcqAZ66aE8",
      likeCount: 12,
      dislikeCount: 4,
      viewCount: 40,
    },
    {
      link: "https://www.youtube.com/embed/hZjkEf_w6go",
      likeCount: 22,
      dislikeCount: 11,
      viewCount: 25,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 gap-1 justify-items-center py-20">
      <h2 className="text-5xl font-semibold text-gray-600 underline my-10">
        Post a Video
      </h2>

      {/* User Posts A Video */}

      {/* form */}
      <form
        className="w-full   grid grid-cols-1 justify-items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-control grid grid-cols-1 justify-items-center shadow-2xl p-20 w-full max-w-2xl">
          {/* Youtube url input */}
          <label className="label justify-self-start">
            <span className="label-text">Video</span>
          </label>
          <input
            type="text"
            placeholder="http://"
            className="input input-bordered border-primary w-full max-w-xl shadow-xl"
            {...register("url", {
              required: {
                value: true,
                message: "A link is Required",
              },
            })}
          />
          <label className="label">
            {errors.url?.type === "required" && (
              <span className="text-red-500 label-text-alt">
                {errors.url.message}
              </span>
            )}
          </label>
          <label className="justify-self-start">Share youtube link</label>

          {/* Post Button */}
          <input
            className="btn btn-secondary w-full shadow-xl text-blue-900  hover:drop-shadow-xl ease-in"
            value="Post Video Link"
            type="submit"
          />
        </div>
      </form>

      {/* User Information */}
      <div>
        <h2 className="text-5xl font-semibold text-gray-600 underline mb-5 mt-20 ">
          User Information
        </h2>
        <p className="text-2xl mt-10">
          Name:{" "}
          <span className="font-mono text-accent hover:underline text-2xl">
            {user.displayName}
          </span>
        </p>
        <p className="text-2xl ">
          Email:{" "}
          <span className="font-mono text-accent hover:underline text-2xl">
            {user.email}
          </span>
        </p>
        <hr className="mt-10"></hr>
        <hr />
        <hr />
        <hr />

        {/* Videos Added By User */}
        <div>
          <h2 className="text-center mt-10 text-3xl">
            Videos Added By{" "}
            <span className="underline font-semibold">{user.displayName}</span>{" "}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-1 justify-items-center my-10">
            {/* add refetch from react query */}
            {videos.map((video) => (
              <UserAddedVideo key={video} video={video}></UserAddedVideo>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
