import { fetchData } from './fetchdata';
import { GraphQLServer } from 'graphql-yoga'
// rickymorty entry point
const url = 'https://rickandmortyapi.com/api/character/';

const typeDefs = `
type Query {
  character(id: Int!): Character
  characters(page: Int, pageSize: Int): [Character!]!
  planets: [String!]!
}

type Character{
    id: Int!
    name: String!
    status: String!
    planet: String!

} `


/**
 * Main App
 * @param data all rickyandmorty database
 */
const runApp = data => {

    const resolvers = {
        Query: {
          character: (parent, args, ctx, info) => {
          const character = data.find(element => args.id == element.id);
          return{
            id: character.id,
            name: character.name,
            status: character.status,
            planet: character.origin.name
            }
          },
          characters: (parent, args, ctx, info) => {
              const page = args.page || 1;
              const pageSize = args.pageSize || 20;

              const init = (page-1)*pageSize;
              const end = init + pageSize;

              const result = data.slice(init, end);

              const ret = result.map(obj => {
                  return{
                      id: obj.id,
                      name: obj.name,
                      status: obj.status,
                      planet: obj.location.name
                  }
              })
              return ret;
          },
          planets: (parent, args, ctx, info) => {
              const arr = [];
              data.forEach(element => {
                  arr.push(element.location.name)
              })
              return[...new Set(arr)]
          }
        }
    }
  const server = new GraphQLServer({typeDefs, resolvers})
  server.start({port:3501})
};

// main program
fetchData(runApp, url);
