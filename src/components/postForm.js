import gql from "graphql-tag";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import { useForm } from '../util/hooks';
import { FETCH_POST_QUERY } from '../util/graphQL'

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    onError: (err) => {
      console.log(err)
    },
    update: (proxy, res) => {
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY
      })
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          getPosts: [res.data.createPost, ...data.getPosts]
        }
      })
      values.body = '';
    }
  })

  function createPostCallback() {
    createPost()
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post</h2>
        <Form.Field>
          <Form.Input
            placeholder='hi world'
            name='body'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{marginBottom: 20}}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  )
}

const CREATE_POST = gql`
  mutation createPost( $body: String! ){
    createPost(body: $body){
      id
      body
      username
      likes{
        id
        username
        createdAt
      }
      likeCount
      comments{
        id
        body
        username
        createdAt
      }
      commentCount
      createdAt
    }
  }
`

export default PostForm