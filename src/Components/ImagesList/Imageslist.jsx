import React, { useEffect, useState } from "react";
import "./Imageslist.css";
import { db } from "../../firebaseinit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImages from "../../assets/logo";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  // getDocs,
  // query,
  // where,
} from "firebase/firestore";

export default function Imageslist({ albumId, onBackClick, album }) {
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [images, setImages] = useState([]);
  const [editImageId, setEditImageId] = useState(null);
  const [orignalData, setOriginalData] = useState(null);

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setEditImageId(null); // Reset editImageId when toggling the form
  };

  const handleAddImage = async () => {
    try {
      if (editImageId) {
        // If editImageId is not null, update the existing image
        await setDoc(doc(db, "images", editImageId), {
          albumId,
          title,
          imageUrl,
        });
        toast.success("Image updated successfully!");
      } else {
        // Otherwise, add a new image
        await addDoc(collection(db, "images"), {
          albumId,
          title,
          imageUrl,
        });
        toast.success("Image added successfully!");
      }
      setTitle("");
      setImageUrl("");
      setEditImageId(null); // Reset editImageId after successful add/update
    } catch (error) {
      console.error("Error adding/updating image to Firebase: ", error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteDoc(doc(db, "images", imageId));
      toast.success("Image Deleted successfully!");
    } catch (error) {
      console.error("Error deleting image from Firebase: ", error);
    }
  };

  const handleEditImage = (image) => {
    setTitle(image.title);
    setImageUrl(image.imageUrl);
    setEditImageId(image.id);
    setShowForm(true);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "images"),
      (querySnapshot) => {
        const imagesData = querySnapshot.docs
          .filter((doc) => doc.data().albumId === albumId)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setImages(imagesData);
        setOriginalData(imagesData);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [albumId]);

  // const containsSubstring = (str, substring) => {
  //   return str.includes(substring);
  // };

  const handleSearch = (e) => {
    let searchValue = e.target.value;
    setSearchInput(searchValue);
    const orginalArray = [...orignalData];
    const newArray = orginalArray.filter((obj) =>
      obj.title.toLowerCase().includes(searchValue)
    );
    if (!searchValue) {
      setImages(orignalData);
    }
    setImages(newArray);
  };

  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
    setSearchInput("");
  };
  return (
    <>
      <div className="imageslistmain">
        <div className="top">
          <img
            src={logoImages.back}
            alt="back"
            className="back"
            onClick={onBackClick} // Invoke the onBackClick callback
          />
          <div className="subContainer">
            <h1>
              {images.length === 0 ? "No images found " : "Images in "}
              {album.name}
            </h1>

            <div className="search-container">
              {images.length === 0
                ? null
                : !showSearch && (
                    <img
                      src={logoImages.search}
                      alt="search"
                      className="search"
                      onClick={toggleSearchBar}
                    />
                  )}
              {showSearch && (
                <div className="">
                  <img
                    src={logoImages.clear}
                    alt="clear"
                    onClick={toggleSearchBar}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {showSearch && (
          <div className="searchBar">
            <input
              type="text"
              placeholder="Search Image here..."
              value={searchInput}
              onChange={handleSearch}
              required
              autoFocus
            />
          </div>
        )}
        <button
          className="addingimg"
          onClick={handleToggleForm}
          style={{
            backgroundColor: showForm
              ? "rgba(255, 19, 0, 0.1)"
              : "rgba(0, 119, 255, 0.1)",
            border: showForm ? "2px solid #ff1300" : "2px solid #07f",
            color: showForm ? "#ff1300" : "#07f",
          }}
        >
          {showForm ? "Cancel" : "Add Image"}
        </button>

        {showForm && (
          <div className="imageslistform">
            <h1>{editImageId ? "Edit Image" : "Add Image to Album"}</h1>
            <input
              type="text"
              placeholder="Title"
              className="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              className="imgurl"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="imageslistbtn">
              <button
                className="clear"
                onClick={() => {
                  setTitle("");
                  setImageUrl("");
                  setEditImageId(null);
                }}
              >
                Clear
              </button>
              <button className="add" onClick={handleAddImage}>
                {editImageId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        )}

        <div className="showimg">
          {images.map((image, index) => (
            <div className="bottom">
              <div key={image.id} className="card">
                <div className="hover">
                  <img
                    src={logoImages.edit}
                    alt="edit"
                    className="edit"
                    onClick={() => handleEditImage(image)}
                  />
                  <img
                    src={logoImages.trashbin}
                    alt="delete"
                    className="delete"
                    onClick={() => handleDeleteImage(image.id)}
                  />
                </div>
                <img src={image.imageUrl} alt="" className="bottomimg" />
                <p>{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
      {/* Include ToastContainer to display toast messages */}
    </>
  );
}
