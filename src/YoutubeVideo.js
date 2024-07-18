import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YoutubeLive = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = 'AIzaSyAXdnFY1ojesdU7Bng3UI1EVcRDezsCyMU';
    const channelId = 'UCqpfaQS5MRpI_As13qX3-hA';

    const fetchLiveVideo = async () => {
      try {
        const liveResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              key: apiKey,
              channelId: channelId,
              part: 'snippet',
              type: 'video',
              eventType: 'live',
              maxResults: 1,
            },
          }
        );

        if (liveResponse.data.items.length > 0) {
          const liveVideo = liveResponse.data.items[0];
          setVideo({
            title: liveVideo.snippet.title,
            description: liveVideo.snippet.description,
            videoId: liveVideo.id.videoId,
            thumbnail: liveVideo.snippet.thumbnails.default.url,
            live: true,
          });
          setLoading(false);
          setError(null);
        } else {
          const completedResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
              params: {
                key: apiKey,
                channelId: channelId,
                part: 'snippet',
                type: 'video',
                eventType: 'completed',
                order: 'date',
                maxResults: 7,
              },
            }
          );

          if (completedResponse.data.items.length > 0) {
            const latestVideo = completedResponse.data.items[0];
            setVideo({
              title: latestVideo.snippet.title,
              description: latestVideo.snippet.description,
              videoId: latestVideo.id.videoId,
              thumbnail: latestVideo.snippet.thumbnails.default.url,
              live: false,
            });
            setLoading(false);
            setError(null);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLiveVideo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>No videos found.</div>;
  }

  // return (
  //   <div>
  //     <h1>{video.title}</h1>
  //     <p>{video.description}</p>
  //     <iframe
  //       width="560"
  //       height="315"
  //       src={`https://www.youtube.com/embed/${video.videoId}`}
  //       frameBorder="0"
  //       allowFullScreen
  //     ></iframe>
  //     {video.live && <p>This is a live video.</p>}
  //   </div>
  // );
  return (
    <div>
      <h1>{video.title}</h1>
      <p>{video.description}</p>
      {video.live ? (
        <div>
          <div style={{ width: '100%', height: '0', paddingBottom: '56.25%', position: 'relative' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allowFullScreen
              style={{ position: 'absolute', width: '100%', height: '100%', top: '0', left: '0' }}
            ></iframe>
          </div>
          <p>This is a live video.</p>
        </div>
      ) : (
        <div>
          <p>This video is not live.</p>
          <div style={{ width: '100%', height: '0', paddingBottom: '56.25%', position: 'relative' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', width: '100%', height: '100%', top: '0', left: '0' }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default YoutubeLive;
