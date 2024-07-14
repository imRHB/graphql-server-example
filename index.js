import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import db from "./_db.js";
import { typeDefs } from "./schema.js";

const PORT = 4000;

/* resolvers */
const resolvers = {
    Query: {
        games: () => db.games,
        // game: (parent, args, ctx) => {}
        game: (_, args) => db.games.find((game) => game.id === args.id),
        authors: () => db.authors,
        author: (_, args) => db.authors.find((author) => author.id === args.id),
        reviews: () => db.reviews,
        review: (_, args) => db.reviews.find((review) => review.id === args.id),
    },
    Game: {
        reviews: (parent) =>
            db.reviews.filter((rev) => rev.game_id === parent.id),
    },
    Author: {
        reviews: (parent) =>
            db.reviews.filter((rev) => rev.author_id === parent.id),
    },
    Review: {
        author: (parent) =>
            db.authors.find((aut) => aut.id === parent.author_id),
        game: (parent) => db.games.find((game) => game.id === parent.game_id),
    },
    Mutation: {
        addGame: (_, args) => {
            const newGame = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString(),
            };
            db.games.push(newGame);

            return newGame;
        },
        updateGame: (_, args) => {
            db.games = db.games.map((game) => {
                if (game.id === args.id) {
                    return { ...game, ...args.game };
                }

                return game;
            });

            return db.games.find((game) => game.id === args.id);
        },
        deleteGame: (_, args) => db.games.filter((game) => game.id !== args.id),
    },
};

/* server setup */
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
});

console.log(`Server ready at ${url}`);
