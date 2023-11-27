import React from 'react'
import video from './/skyline.mp4';
import styled from 'styled-components';

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;


export default function VideoBackgroundWorld() {
  return (
    <VideoBackground src={video} autoPlay loop muted />
  )
}
