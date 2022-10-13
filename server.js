const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const {graphqlHTTP} = require('express-graphql');
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt} = require('graphql');

const {authors, books} = require('./data');

const BookType = new GraphQLObjectType({
  name: 'Books',
  description: 'A single Book',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    authorId: {type: GraphQLNonNull(GraphQLInt)},
    author: {
      type: AuthorType,
      resolve: (book) => {
       return authors.find(author => author.id === book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'Author of a book',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},    
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const rootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'Single Book',
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => {
        return books.find(book => book.id === args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books
    },
    author: {
      type: AuthorType,
      description: 'Single Author',
      args: {
        id: {type: GraphQLInt}
      },
      resolve: (parent, args) => {
        return authors.find(author => author.id === args.id)
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors
    },
    test: {
      type: GraphQLString,
      resolve: () => 'hello test'
    }
  })
})

const rootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add Book',
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
      },
      resolve: (parent, args) => {
        const book = {id: (books.length + 1), name: args.name, authorId: args.authorId};
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add Author',
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        // id: {type: GraphQLNonNull(GraphQLInt)} 
      },
      resolve: (parent, args) => {
        const author = {id: authors.length + 1, name: args.name, };
        authors.push(author);
        return author;
      }
    }
  })
})

const Schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType
})

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}))

app.get('/', (req, res) => {
  res.send('This is the first response from the server');
})

app.listen(PORT, () => console.log(`Server is running at PORT: ${PORT}`))