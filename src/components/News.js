import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps ={
    country : "in",
    pageSize : 8,
    category : "general"
  }
  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
  }

  constructor(props){
    super(props);
    this.state={
      articles : [],
      loading : true,
      page :1,
      totalResults : 0
    
    }
    document.title = `NewsMonkey-${this.props.category}`
  }

  async UpdateData(){
    this.props.setProgress(10)
    console.log( "initial page = "+ this.state.page)
    let url = `https://newsapi.org/v2/top-headlines?country=in&category=${this.props.category}&apiKey=a34c39c4ea49401aaadec76be7befbf0&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url)
    this.props.setProgress(30)
    let parsedData =await data.json()
    this.props.setProgress(70)
    console.log(parsedData)
    this.setState({
      articles : parsedData.articles,
      totalResults : parsedData.totalResults,
      loading : false
    })
    console.log(this.state.page)
    this.props.setProgress(100)
    }
  async componentDidMount(){
    // let url = `https://newsapi.org/v2/top-headlines?country=in&category=${this.props.category}&apiKey=a34c39c4ea49401aaadec76be7befbf0&
    //            page=${this.state.page}&pagesize=${this.props.pageSize}`;
    // this.setState({loading:true})
    // let data = await fetch(url)
  
    // let parsedData =await data.json()
    // console.log(parsedData)
    // this.setState({
    //   articles : parsedData.articles,
    //   totalResults : parsedData.totalResults,
    //   loading : false
    // })
    // console.log(this.state.page)
    this.UpdateData();
  }

  

  handleNextClick= async()=>{

    if( !(this.state.page > Math.ceil(this.state.totalResults/this.props.pageSize))){
    //   console.log("next")
    // let url = `https://newsapi.org/v2/top-headlines?country=in&category=${this.props.category}&apiKey=a34c39c4ea49401aaadec76be7befbf0&page=${this.state.page + 1}&pagesize=${this.props.pageSize}`;
    // this.setState({loading:true})
    // let data = await fetch(url)
    // let parsedData =await data.json()
    // this.setState({
    //   page: this.state.page +1,
    //   articles : parsedData.articles,
    //   loading :false

    await this.setState({page: this.state.page + 1});
    await this.UpdateData();
    }
  }
  

  handlePreviousClick= async()=>{
    console.log("previous")
  // this.setState({loading:true})
  //   let url = `https://newsapi.org/v2/top-headlines?country=in&category=${this.props.category}&apiKey=a34c39c4ea49401aaadec76be7befbf0&page=${this.state.page - 1}&pagesize=${this.props.pageSize}`;
  //   let data = await fetch(url)
    
  //   let parsedData =await data.json()
  //   this.setState({
  //     page: this.state.page -1,
  //     articles : parsedData.articles,
  //     loading :false
  //   })

    await this.setState({page: this.state.page - 1});
    await this.UpdateData();
  }
  fetchMoreData = async() => {
    await this.setState({page: this.state.page + 1});
    let url = `https://newsapi.org/v2/top-headlines?country=in&category=${this.props.category}&apiKey=a34c39c4ea49401aaadec76be7befbf0&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    let data = await fetch(url)
  
    let parsedData =await data.json()
    console.log(parsedData)
    this.setState({
      articles : this.state.articles.concat(parsedData.articles),
      totalResults : parsedData.totalResults,
      loading : false
    })
  };



  render() {
    return (
          <>
            <h1 className="text-center">Newsmonkey-top {this.props.category} headlines</h1>
            { this.state.loading && <Spinner />}

            <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className="container">

          
          <div className="row">
              {this.state.articles.map((item)=>{ 
                return <div className="col-md-3" key={item.url}> 
                <NewsItem  title={item.title?item.title.slice(0,45):""} discription={item.description?item.description.slice(0,88):""}
                  imageUrl={item.urlToImage} newsUrl={item.url} author={item.author} date={item.publishedAt} source={item.source.name}/>
                </div>
              })}
            
          </div>
          </div>
          </InfiniteScroll>
          
          </>
    )
  }
}

export default News