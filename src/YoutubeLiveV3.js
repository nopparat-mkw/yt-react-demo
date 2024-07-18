import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Spin, Card, Row, Col, Typography } from "antd";
const { Meta } = Card;
const { Text } = Typography;

const YoutubeLiveV3 = () => {
  const [liveVideos, setLiveVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/ytapi/videolive"); // Change this URL to match your API endpoint
        const { data } = response;

        // Separate live and completed videos
        const liveVideosData = data.filter(video => video.live);
        const completedVideosData = data.filter(video => !video.live);

        // Sort completed videos by publishedAt
        completedVideosData.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        setLiveVideos(liveVideosData);
        setCompletedVideos(completedVideosData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <Spin size="large" />;
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
        <Card
          title={liveVideos[0].title}
          style={{ maxWidth: 800, margin: "0 auto", marginBottom: 16 }}
        >
          <p>{liveVideos[0].description}</p>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
            <iframe
              title={liveVideos[0].title}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${liveVideos[0].videoId}`}
              frameBorder="0"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
          <Text strong>This is a live video.</Text>
        </Card>
      ) : (
        <Card
          title={completedVideos[0].title}
          style={{ maxWidth: 800, margin: "0 auto", marginBottom: 16 }}
        >
          <p>{completedVideos[0].description}</p>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", maxWidth: "100%" }}>
            <iframe
              title={completedVideos[0].title}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${completedVideos[0].videoId}`}
              frameBorder="0"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          </div>
          <Text strong>This video is not live.</Text>
          <Text>Published at: {moment(completedVideos[0].publishedAt).format("MMMM Do YYYY, HH:mm:ss")}</Text>
        </Card>
      )}

      <Typography.Title level={3}>Previous Completed Videos</Typography.Title>
      <Row gutter={16}>
        {completedVideos.slice(1).map((video, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={video.title} src={video.thumbnail} />}
              onClick={() => handleThumbnailClick(video.videoId)}
            >
              <Meta title={video.title} description={`Published at: ${moment(video.publishedAt).format("MMMM Do YYYY, HH:mm:ss")}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default YoutubeLiveV3;
