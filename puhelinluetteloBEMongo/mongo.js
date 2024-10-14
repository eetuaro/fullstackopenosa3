const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

// Komentoriviparametrit: salasana, nimi, numero
const args = process.argv;

if (args.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  process.exit(1);
}

const password = args[2];

// Yhdistä MongoDB:hen
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Määrittele schema ja model
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (args.length === 3) {
  // Listaa kaikki tietokannan tiedot
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (args.length === 5) {
  const name = args[3];
  const number = args[4];

  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log(
    'Please provide the correct arguments: node mongo.js <password> [<name> <number>]'
  );
  mongoose.connection.close();
}
