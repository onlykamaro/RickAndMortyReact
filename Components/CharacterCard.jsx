const CharacterCard = ({ character, onDelete }) => {
    const handleDelete = async () => {
        onDelete && (await onDelete(character.id))
    }

    return (
        <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card mb-4">
                <img 
                src={character.image}
                alt={character.image}
                className="card-img-top img-fluid"
                />

                <div className="card-body">
                    <h5 className="card-title">{character.name}</h5>
                    <p className="card-text">Species: {character.species}</p>
                    <p className="card-text">Gender: {character.gender}</p>
                </div>
                <div className="card-footer">
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default CharacterCard