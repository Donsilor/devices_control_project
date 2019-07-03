// @charset "utf-8";
// 顶部工具栏
const Toolbar = {
    /** 
     * 计数变量的赋值 
     */  
    _setCount: function() {
      console.log('_setCount')
      var curPage = window.sessionStorage.getItem('cur_news_page')  
      curPage = curPage || 1  
      curPage = parseInt(curPage) + 1
      window.sessionStorage.setItem('cur_news_page', curPage)
      window.sessionStorage.setItem('total_news_page', window.history.length)  
    },
  /**
   * 是否为第一页
   * @returns {Boolean}
   */
  _isFirstPage: function() {
    var curPage = window.sessionStorage.getItem('cur_news_page')
    curPage = curPage || 1
    if (curPage == 1) {
      return true
    }
    return false
  },
  /**
   * 是否为最后一页
   * @returns {Boolean}
   */

  _isLastPage: function() {
    var curPage = window.sessionStorage.getItem('cur_news_page')
    var totalPage = window.sessionStorage.getItem('total_news_page')
    curPage = curPage || 1
    totalPage = totalPage || 1
    if (curPage == totalPage) {
      return true
    }
    return false
  },
  /**
   * 前进
   */

  _forword: function() {
    var curPage = window.sessionStorage.getItem('cur_news_page')
    window.sessionStorage.setItem('cur_news_page', parseInt(curPage) + 1)
  },
  /**
   * 后退
   */
  _goback: function() {
    var curPage = window.sessionStorage.getItem('cur_news_page')
    window.sessionStorage.setItem('cur_news_page', parseInt(curPage) - 1)
    history.go(-1)
  }
}

export default Toolbar
