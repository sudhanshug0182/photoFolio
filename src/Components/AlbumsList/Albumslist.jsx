import React, { useState, useEffect } from "react";
import { db } from "../../firebaseinit";
import "./Albumslist.css";
import Albumform from "../AlbumForm/Albumform";
import Imageslist from "../ImagesList/Imageslist";
import logoImages from "../../assets/logo";

import {
  collection,
  getDocs, 
  addDoc,
  // doc,
  // deleteDoc,
  // onSnapshot,
} from "firebase/firestore";

export default function Albumslist() {
  const [albums, setAlbums] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // any kind of side effect should be performed under useEffect
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Fetch albums from the Firestore database
  const fetchAlbums = async () => {
    const querySnapshot = await getDocs(collection(db, "albums"));
    const albumsData = [];
    querySnapshot.forEach((doc) => {
      albumsData.push({ id: doc.id, name: doc.data().name });
    });
    setAlbums(albumsData);
  };

  // Toggle the visibility of the album creation form
  const toggleAddAlbum = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  // Create a new album in the Firestore database
  const handleAlbumCreate = async (name) => {
    try {
      const docRef = await addDoc(collection(db, "albums"), {
        name: name,
      });
      setAlbumName(name);
      fetchAlbums(); // Fetch albums again to update the UI
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  // Handle the click event when an album is clicked
  const handleAlbumClick = (album) => {
    // setSelectedAlbumId(albumId);
    setSelectedAlbumId(album.id);
    setSelectedAlbum(album);
    setShowForm(false); // Hide the form when clicking on an album
  };

  // Handle the click event when the back button is clicked
  const handleBackClick = () => {
    setSelectedAlbumId(null);
  };
  return (
    <>
      <div className="outerContainer">
        <div className="albumListMain">
          {/* !selectedAlbumId--> null */}
          {!selectedAlbumId && (
            <div className="titleBar">
              <h2 className="text">Your Albums</h2>
              <button
                className="addbtn"
                onClick={toggleAddAlbum}
                style={{
                  backgroundColor: showForm ? "rgba(255, 19, 0, 0.1)" : "rgba(0, 119, 255, 0.1)",
                  border: showForm ? "2px solid #ff1300" : "2px solid #07f",
                  color: showForm ? "#ff1300" : "#07f",
                }}
              >
                {showForm ? "Cancel" : "Add Album"}
              </button>
            </div>
          )}

          {showForm && <Albumform onAlbumCreate={handleAlbumCreate} />}

          {!selectedAlbumId && albums.length > 0 && (
            <div className="albumList">
              {albums.map((album) => (
                <div
                  className="album"
                  key={album.id}
                  onClick={() => handleAlbumClick(album)}
                >
                  <img
                    src={logoImages.album}
                    alt="album"
                  />
                  <span>{album.name}</span>
                </div>
              ))}
            </div>
          )}

          {selectedAlbumId && (
            <Imageslist
              albumId={selectedAlbumId}
              onBackClick={handleBackClick}
              album={selectedAlbum}
            />
          )}
        </div>
      </div>
    </>
  );
}
 