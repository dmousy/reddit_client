import { createSlice, createSelector } from '@reduxjs/toolkit';
import { getSubredditPosts, getPostComments } from '../api/reddit';

const initialState = {
    post: [],
    error: false,
    isLoading: false,
    searchTerm: '',
    selectedSubreddit: '/r/pixelsart',
};

const redditSlice = createSlice ({
    name: 'redditPosts',
    initialState,
    reducers: {
        setPost(state, action) {
            state.posts = action.payload;
        },
        startGetPost(state) {
            state.isLoading = true;
            state.error = false;
        },
        getPostSuccess(state, action) {
            state.isLoading = false;
            state.post = action.payload;
        },
        getPostFailed(state) {
            state.isLoading = false;
            state.error = true;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setSelectedSubreddit(state, action) {
            state.selectedSubreddit = action.payload;
            state.searchTerm = '';
        },
        toggleShowingComments(state, action) {
            state.post[action.payload].showingComments = !state.post[action.payload].showingComments;
        },
        stateGetComments(state, action) {
            //don't fetch comments if we're hidding them
            state.post[action.payload].showingComments = !state.post[action.payload].showingComments;
            if (!state.post[action.payload].showingComments) {
                return;
            }
            state.posts[action.payload].loadingComments = false;
            state.posts[action.payload].error = true;
        },
    },
});

export const {
    setPost,
    getPostsFailed,
    getPostsSuccess,
    startGetPosts,
    setSearchTerm,
    setSelectedSubreddit,
    toggleShowingComments,
    getCommentsFailed,
    getCommentsSuccess,
    startGetComments
} = redditSlice.actions;

export default redditSlice.reducer;

//redux thunk for comments

export const fetchPosts = (subreddit) => async (dispatch) => {
    try {
        dispatch(startGetPosts());
        const posts = await getSubredditPosts(subreddit);

        //adding ShowingComments and comments as additional fields when user wants to showing them. Needs to call to another API endpoint for each post's comments
        const postsWithMetadata = posts.map((post) => ({
            ...post,
            showingComments: false,
            comments: [],
            loadingComments: false,
            errorComments: false,
        }));
        dispatch(getPostsSuccess(postsWithMetadata));
    } catch (error) {
        dispatch(getPostsFailed());
    }
};

export const fetchComments = (index, permalink) => async (dispatch) => {
    try {
        dispatch(startGetComments(index));
        const comments = await getPostComments(permalink);
        dispatch(getCommentsSuccess({index, comments}));
    } catch (error) {
        dispatch(getCommentsFailed(index));
    }
};

const selectPosts = (state) => state.reddit.posts;
const selectSearchTerm = (state) => state.redit.searchTerm;
export const selectSelectedSubreddit = (state) => state.reddit.selectedSubreddit;

export const selectFilteredPost = createSelector (
    [selectPosts, selectSearchTerm], (posts, searchTerm) => {
        if (searchTerm !== '') {
            return posts.filter((post) => 
                post.title.toLoweCase().includes(searchTerm.toLoweCase())
            );
        }
        return posts;
    }
);