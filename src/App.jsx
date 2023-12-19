/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import toast from "react-hot-toast"
import CharacterCard from "../Components/CharacterCard"
import AddCharacterForm from "../Components/AddCharacterForm"

const App = () => {
  const [characters, setCharacters] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [editCharacter, setEditCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const dialogRef = useRef(null)

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3004/characters/`, {
        params: {
          _page: currentPage,
          _limit: 4,
          // _sort: "id",
          // _order: "desc",
        },
      })

      console.log(response)

      return response.data
    } catch (error) {
      console.error("Error fetching data:", error)
      return []
    }
  }

  const handleDataFetched = async () => {
    setLoading(true)

    const data = await fetchData()

    setCharacters((prevCharacters) =>
      initialLoadComplete ? [...prevCharacters, ...data] : data
    )

    setLoading(false)

    setInitialLoadComplete(true)
  }

  useEffect(() => {
    // Fetch initial data when the component mounts
    handleDataFetched()
  }, [currentPage])

  const handleLoadMore = async () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handleDeleteCharacter = async (characterId) => {
    try {
      await axios.delete(`http://localhost:3004/characters/${characterId}`)
      toast.success(`Character deleted successfully!`)

      // Filter out the deleted character from the existing array
      setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== characterId)
      )
    } catch (error) {
      console.error("Error deleting character:", error)
      toast.error(`Failed to delete character.`)
    }
  }

  const handleEditCharacter = (character) => {
    setEditCharacter(character)
    dialogRef.current.showModal()
  }

  const handleCancelEdit = () => {
    setEditCharacter(null)
    dialogRef.current.close()
  }

  const handleSaveEdit = async (editedData) => {
    try {
      // Validate the input fields
      if (!editedData.name || !editedData.species || !editedData.gender) {
        return Promise.reject("Validation failed.") // Reject the promise for error state
      }

      // Make an axios request to update the character data
      const response = await axios.put(
        `http://localhost:3004/characters/${editCharacter.id}`,
        editedData
      )

      setCharacters((prevCharacters) =>
        prevCharacters.map((character) =>
          character.id === editCharacter.id ? editedData : character
        )
      )

      setEditCharacter(null)
      handleCancelEdit()

      // Resolve the promise for success state
      return Promise.resolve(response)
    } catch (error) {
      console.error("Error editing character:", error)

      // Reject the promise for error state
      return Promise.reject(error)
    }
  }

  const handleInputChange = (field, value) => {
    // Update the editCharacter state with the edited field
    setEditCharacter((prevEditCharacter) => ({
      ...prevEditCharacter,
      [field]: value,
    }))
  }

  const handleAddCharacter = async (newCharacter) => {
    try {
      // Update the characters array with the new character

      // Make an axios request to add the new character
      await axios.post("http://localhost:3004/characters", newCharacter)

      const data = await fetchData()

      setCharacters(data)

      // setCharacters((prevCharacters) => [...prevCharacters, newCharacter])
      toast.success("Character added successfully!")
    } catch (error) {
      console.error("Error adding character:", error)
      toast.error("Failed to add character.")
    }
  }

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-center">Rick and Morty Characters</h1>
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={handleDeleteCharacter}
                onEdit={handleEditCharacter}
              />
            ))}
          </>
        )}
      </div>

      <dialog ref={dialogRef}>
        <div className="row">
          <h2>Edit Character</h2>
        </div>
        <div className="row mb-4">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={editCharacter?.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="species">Species</label>
            <input
              type="text"
              className="form-control"
              id="species"
              value={editCharacter?.species || ""}
              onChange={(e) => handleInputChange("species", e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              className="form-select"
              id="gender"
              value={editCharacter?.gender || ""}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-auto">
            <button onClick={handleCancelEdit} className="btn btn-secondary">
              Cancel
            </button>
          </div>
          <div className="col-auto">
            <button
              onClick={() => {
                toast.promise(handleSaveEdit(editCharacter), {
                  loading: "Saving character...",
                  success: "Character saved successfully!",
                  error: "Error saving character.",
                })
              }}
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {characters.length > 0 && !loading && (
        <div className="text-center mt-3">
          <button onClick={handleLoadMore} className="btn btn-primary">
            Load More
          </button>
        </div>
      )}

      <AddCharacterForm onAddCharacter={handleAddCharacter} />
    </div>
  )
}

export default App
