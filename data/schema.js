import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat
} from 'graphql';

import axios from 'axios';

function usersFollowing() {
  return {
    type: new GraphQLList(RepoInfoType),
    description: 'Fields about the people this person follows',
    resolve: (obj) => {
      const brackIndex = obj.following_url.indexOf('({'),
      const url = obj.following_url.slice(0, brackIndex);
      return axios.get(url)
                  .then(response => response.data);
    }
  }
}

const query = new GraphQLObjectType({
  name: 'Query',
  description: 'First GraphQL Server Config',
  fields: () => ({
    gitHubUser: {
      type: UserInfoType,
      description: 'GitHub user API data with enhanced and additional data',
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The GitHub user login you want information on'
        }
      },
      resolve: (_, { username }) => {
        const url = `https://api.github.com/users/${username}`;
        return axios.get(url)
                    .then(response => response.data);
      }
    }
  })
});

const RepoInfoType = new GraphQLObjectType({
  name: 'RepoInfo',
  fields: () => ({
    'login': { type: GraphQLString },
    'avatar_url': { type: GraphQLString },
    'id': { type: GraphQLInt },
    'url': { type: GraphQLString },
    'html_url': { type: GraphQLString },
    'gists_url': { type: GraphQLString },
    'starred_url': { type: GraphQLString },
    'repos_url': { type: GraphQLString }
  })
});

const UserInfoType = new GraphQLObjectType({
  name: 'UserInfo',
  description: 'Basic information on a GitHub user',
  fields: () => ({
    'login': { type: GraphQLString },
    'id': { type: GraphQLInt },
    'avatar_url': { type: GraphQLString },
    'site_admin': { type: GraphQLBoolean },
    'following_url': {
      type: GraphQLString,
      resolve: (obj) => {
        const brackIndex = obj.following_url.indexOf('{');
        return obj.following_url.slice(0, brackIndex);
      }
    },
    'users_following': usersFollowing()
  })
});

const schema = new GraphQLSchema({
  query
});

export default schema;
