import React from "react";

import { Table, Icon } from "semantic-ui-react";

import "./ListSongs.scss";

const ListSongs = ({ songs, albumImage, playerSong }) => {
  return (
    <Table inverted className="list-songs">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Título</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {songs.map((song) => (
          <Song
            key={song.id}
            song={song}
            albumImage={albumImage}
            playerSong={playerSong}
          />
        ))}
      </Table.Body>
    </Table>
  );
};

function Song({ song, albumImg, playerSong }) {
  const onPlay = () => {
    playerSong(albumImg, song.name, song.fileName);
  };

  return (
    <Table.Row onClick={onPlay}>
      <Table.Cell collapsing>
        <Icon name="play circle outline" />
      </Table.Cell>
      <Table.Cell>{song.name}</Table.Cell>
    </Table.Row>
  );
}

export default ListSongs;
