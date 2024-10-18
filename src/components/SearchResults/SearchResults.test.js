import { render, fireEvent, screen } from "@testing-library/react";
import SearchResults from "./SearchResults";

test("renders search results and adds track to playlist", () => {
  const addToPlaylist = jest.fn();
  const searchResults = [
    { id: 1, name: "Track 1", artist: "Artist 1", album: "Album 1" },
  ];

  render(
    <SearchResults
      searchResults={searchResults}
      addToPlaylist={addToPlaylist}
    />
  );

  expect(screen.getByText("Track 1")).toBeInTheDocument();
  fireEvent.click(screen.getByText("+"));
  expect(addToPlaylist).toHaveBeenCalledWith(searchResults[0]);
});
