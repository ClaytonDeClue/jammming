import { render, screen } from "@testing-library/react";
import TrackList from "./TrackList";

test("renders track list", () => {
  const tracks = [
    { id: 1, name: "Track 1", artist: "Artist 1", album: "Album 1" },
    { id: 2, name: "Track 2", artist: "Artist 2", album: "Album 2" },
  ];

  render(
    <TrackList tracks={tracks}/>
  );

  expect(screen.getByText('Track 1')).toBeInTheDocument();
  expect(screen.getByText('Artist 1 | Album 1')).toBeInTheDocument();
  expect(screen.getByText('Track 2')).toBeInTheDocument();
  expect(screen.getByText('Artist 2 | Album 2')).toBeInTheDocument();
});
