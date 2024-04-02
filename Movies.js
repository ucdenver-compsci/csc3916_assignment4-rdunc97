var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect("mongodb+srv://ryanduncan02:G5b6t56hD4bUri67@cluster0.cdwdktp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true });

// Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true, index: true },
    releaseDate: Date,
    genre: {
      type: String,
      enum: [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
      ],
    },
    actors: [{
      actorName: String,
      characterName: String,
    }],
});
MovieSchema.index({ title: 1, releaseDate: 1}, {unique: true});
// return the model
//module.exports = mongoose.model('Movie', MovieSchema);
const Movie = mongoose.model('Movie', MovieSchema);

const addMovies = [
  {
    "title": "Inception",
    "releaseDate": new Date("2010-07-16"),
    "genre": "Science Fiction",
    "actors": [
      {"actorName": "Leonardo DiCaprio", "characterName": "Dom Cobb"},
      {"actorName": "Ellen Page", "characterName": "Ariadne"},
      {"actorName": "Joseph Gordon-Levitt", "characterName": "Arthur"}
    ]
  },
  {
    "title": "The Shawshank Redemption",
    "releaseDate": new Date("1994-09-23"),
    "genre": "Drama",
    "actors": [
      {"actorName": "Tim Robbins", "characterName": "Andy Dufresne"},
      {"actorName": "Morgan Freeman", "characterName": "Ellis Boyd 'Red' Redding"},
      {"actorName": "Bob Gunton", "characterName": "Warden Samuel Norton"}
    ]
  },
  {
    "title": "The Dark Knight",
    "releaseDate": new Date("2008-07-18"),
    "genre": "Action",
    "actors": [
      {"actorName": "Christian Bale", "characterName": "Bruce Wayne / Batman"},
      {"actorName": "Heath Ledger", "characterName": "Joker"},
      {"actorName": "Aaron Eckhart", "characterName": "Harvey Dent / Two-Face"}
    ]
  },
  {
    "title": "Forrest Gump",
    "releaseDate": new Date("1994-07-06"),
    "genre": "Drama",
    "actors": [
      {"actorName": "Tom Hanks", "characterName": "Forrest Gump"},
      {"actorName": "Robin Wright", "characterName": "Jenny Curran"},
      {"actorName": "Gary Sinise", "characterName": "Lieutenant Dan Taylor"}
    ]
  },
  {
    "title": "Pulp Fiction",
    "releaseDate": new Date("1994-10-14"),
    "genre": "Crime",
    "actors": [
      {"actorName": "John Travolta", "characterName": "Vincent Vega"},
      {"actorName": "Samuel L. Jackson", "characterName": "Jules Winnfield"},
      {"actorName": "Uma Thurman", "characterName": "Mia Wallace"}
    ]
  }
];

module.exports = Movie;