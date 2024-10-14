const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {personsToShow.length === 0 ? (
        <p>No persons to show</p>
      ) : (
        personsToShow.map((person) => (
          <div key={person.id}>
            <p>
              {person.name} {person.number}
              <button onClick={() => deletePerson(person.id)}>Delete</button>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Persons;
