import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Grid, Progress, Icon, Input, Image } from "semantic-ui-react";
import ReactPlayer from "react-player";

import "./Player.scss";

const Player = ({ songData }) => {
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const onPlay = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onProgress = (data) => {
    setPlayedSeconds(data.playedSeconds);
    setTotalSeconds(data.loadedSeconds);
  };

  useEffect(() => {
    if (songData?.url) {
      onPlay();
    }
  }, [songData]);

  return (
    <div className="player">
      <Grid>
        <Grid.Column width={4} className="left">
          <Image src={songData?.image} />
          {songData?.name}
        </Grid.Column>
        <Grid.Column width={8} className="center">
          <div className="controls">
            <Icon
              name={playing ? "pause circle outline" : "play circle outline"}
              onClick={playing ? onPause : onPlay}
            />
          </div>
          <Progress
            progress="value"
            value={playedSeconds}
            total={totalSeconds}
            size="tiny"
          />
        </Grid.Column>
        <Grid.Column width={4} className="right">
          <Input
            type="range"
            label={<Icon name="volume up" />}
            min="0"
            max="1"
            step="0.01"
            name="volume"
            onChange={(ev, data) => setVolume(Number(data.value))}
            value={volume}
          />
        </Grid.Column>
      </Grid>
      <ReactPlayer
        className="react-player"
        url={songData?.url}
        playing={playing}
        height="0"
        width="0"
        volume={volume}
        onProgress={(e) => onProgress(e)}
      />
    </div>
  );
};

Player.propTypes = {
  songData: PropTypes.object,
};

export default Player;
