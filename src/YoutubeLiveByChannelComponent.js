import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YOUTUBE_API_KEY = 'AIzaSyAXdnFY1ojesdU7Bng3UI1EVcRDezsCyMU';
const CHANNEL_ID = 'UCqpfaQS5MRpI_As13qX3-hA';

const YoutubeLiveAndCompletedComponent = () => {
    const [liveStreams, setLiveStreams] = useState([]);
    const [completedStreams, setCompletedStreams] = useState([]);
  
    useEffect(() => {
      const fetchStreams = async () => {
        try {
          const liveResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&eventType=live&channelId=${CHANNEL_ID}`
          );
  
          const completedResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&part=snippet&type=video&eventType=completed&channelId=${CHANNEL_ID}&order=date`
          );
  
          setLiveStreams(liveResponse.data.items);
          setCompletedStreams(completedResponse.data.items);
        } catch (error) {
          console.error('Error fetching streams:', error);
        }
      };
  
      fetchStreams();
    }, []);
  
    return (
      <div>
        <h2>Top 5 Live Streams</h2>

          {liveStreams.slice(0, 5).map((stream) => (



            <li key={stream.id.videoId}>
              <p>
                {stream.snippet.title}
              </p>
              <iframe
          width="150"
          height="150"
          src={`https://www.youtube.com/embed/${stream.id.videoId}`}
          allowFullScreen
        ></iframe>
            </li>
          ))}
  
        <h2>Completed Streams</h2>
        <ul>
          {completedStreams.map((stream) => (
            <li key={stream.id.videoId}>
              <p>
                {stream.snippet.title} - {stream.snippet.description}
              </p>
              <iframe
          width="150"
          height="150"
          src={`https://www.youtube.com/embed/${stream.id.videoId}`}
          allowFullScreen
        ></iframe>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default YoutubeLiveAndCompletedComponent;