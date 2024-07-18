import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const YoutubeLiveV2 = () => {
  const [liveVideos, setLiveVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const channelId = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;

    const fetchVideos = async () => {
      try {
        const liveResponse = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              key: apiKey,
              channelId: channelId,
              part: "snippet",
              type: "video",
              eventType: "live",
              maxResults: 1,
            },
          }
        );

        const completedResponse = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              key: apiKey,
              channelId: channelId,
              part: "snippet",
              type: "video",
              eventType: "completed",
              order: "date",
              maxResults: 6,
            },
          }
        );

        if (liveResponse.data.items.length > 0) {
          const liveVideosData = liveResponse.data.items.map((video) => ({
            title: video.snippet.title,
            description: video.snippet.description,
            videoId: video.id.videoId,
            thumbnail: video.snippet.thumbnails.default.url,
            live: true,
          }));
          setLiveVideos(liveVideosData);
        }

        if (completedResponse.data.items.length > 0) {
          console.log("response", completedResponse.data);
          const completedVideosData = completedResponse.data.items.map(
            (video) => ({
              title: video.snippet.title,
              description: video.snippet.description,
              videoId: video.id.videoId,
              thumbnail: video.snippet.thumbnails.default.url,
              publishedAt: video.snippet.publishedAt,
              live: false,
            })
          );
          
          console.log(
            "completedVideosData: ",
            JSON.stringify(completedVideosData)
          );

          completedVideosData.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
          );
          setCompletedVideos(completedVideosData);
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleThumbnailClick = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div>
      {liveVideos.length > 0 ? (
        <div>
          <h2>{liveVideos[0].title}</h2>
          <p>{liveVideos[0].description}</p>
          <div
            style={{
              width: "70%",
              height: "70vw",
              maxWidth: "800px", // Limit max width for larger screens
              maxHeight: "450px", // Limit max height for larger screens
              margin: "0 auto", // Center horizontally
              position: "relative",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${liveVideos[0].videoId}`}
              title={liveVideos[0].title}
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            ></iframe>
          </div>
          <p>This is a live video.</p>
        </div>
      ) : (
        <div>
          <h2>{completedVideos[0].title}</h2>
          <p>{completedVideos[0].description}</p>
          <div
            style={{
              width: "70%",
              height: "70vw",
              maxWidth: "800px", // Limit max width for larger screens
              maxHeight: "450px", // Limit max height for larger screens
              margin: "0 auto", // Center horizontally
              position: "relative",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${completedVideos[0].videoId}`}
              title={completedVideos[0].title}
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0",
                left: "0",
              }}
            ></iframe>
          </div>
          <p>This video is not live.</p>
          <p>
            Published at:{" "}
            {moment(completedVideos[0].publishedAt).format(
              "MMMM Do YYYY, HH:mm:ss"
            )}
          </p>
        </div>
      )}

      <h3>Previous Completed Videos</h3>
      <div style={{ display: "flex" }}>
        {completedVideos.slice(1).map((video, index) => (
          <div key={index} style={{ marginRight: "10px" }}>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                onClick={() => handleThumbnailClick(video.videoId)}
              />
            </a>
            <p>{video.title}</p>
            <p>
              Published at:{" "}
              {moment(video.publishedAt).format("MMMM Do YYYY, HH:mm:ss")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeLiveV2;
