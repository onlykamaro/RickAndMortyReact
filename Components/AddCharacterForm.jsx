import { useState } from "react" 
import toast from "react-hot-toast"

const AddCharacterForm = ({ onAddCharacter }) => {
    const [formData, setFormData] = useState({
        name: "",
        species: "",
        gender: "",
        image: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prevData) => ({ ...prevData, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (
            !formData.name ||
            !formData.species ||
            !formData.gender ||
            !formData.image
        ) {
            toast.error("Please fill in all the fields!")
            return 
        }

        onAddCharacter(formData)

        setFormData({
            name: "",
            species: "",
            gender: "",
            image: "",
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb3">
                <label htmlFor="name" className="form-label">
                    Name: 
                </label>
                <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                    autoComplete="off"
                    placeholder="Enter character's name">
                </input>
            </div>
            <div className="mb3">
                <label htmlFor="species" className="form-label">
                    Species: 
                </label>
                <input 
                    type="text" 
                    id="species" 
                    name="species"
                    value={formData.species} 
                    onChange={handleChange} 
                    autoComplete="off"
                    placeholder="Enter character's species">
                </input>
            </div>
            <div className="mb3">
                <label htmlFor="gender" className="form-label">Gender: </label>
                <select 
                    className="form=select"
                    id="gender"
                    name="gender"
                    onChange={handleChange}
                    autoComplete="off"
                >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="image" className="form-label">Image URL: </label>
                <input
                    type="text"
                    className="form-control"
                    id="iamge"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    autoComplete="off"
                    />
            </div>
            <button type="submit" className="btn btn-primary">
                Add Character
            </button>
        </form>
    )
}

export default AddCharacterForm