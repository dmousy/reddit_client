import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatedList } from 'react-animated-list';
import Post from '../Post/Post';
import PostLoading from '../Post/PostLoading';
import getRandomNumber from '../../utils/getRandomNumber';
import { fetchPosts, selectFilteredPost, setSearchTerm, fetchComments } from '../../store/redditSlice';
import './Home.css';

const Home = () => {
    const reddit = useSelector((state) => state.reddit);
    const { isLoading, error, searchTerm, selectedSubreddit } = reddit;
    const post = useSelector(selectFilteredPost);
    const dispatch = useDispatch();

    useEffect (() => {
        dispatch(fetchPosts(selectedSubreddit));
    }, [dispatch, selectedSubreddit]);

    const onToggleComments = (index) => {
        const getComments = (permalink) => {
            dispatch(fetchComments(index, permalink));
        };

        return getComments;
    }

    if (isLoading) {
        return (
            <AnimatedList animation="zoom">
                {Array(getRandomNumber(3, 10)).fill(<PostLoading />)}
            </AnimatedList>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>Failed to load post.</h2>
                <button
                    type="button"
                    onClick={() => dispatch(fetchPosts(selectedSubreddit))} >
                        Try again
                    </button>
            </div>
        );
    }

    if (post.length === 0) {
        return (
            <div className="error">
                <h2>No post matching "{searchTerm}"</h2>
                <button type="button" onClick={() => dispatch(setSearchTerm(''))} >
                    Go home
                </button>
            </div>
        );
    }

    return (
        <div>
            {post.map((post, index) => (
                <Post
                    key={post.id}
                    post={post}
                    onToggleComments={onToggleComments(index)} />
            ))}
        </div>
    );
};

export default Home;