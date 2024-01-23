class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    return (this._parentEl.querySelector('.search__field').value = '');
  }

  addHandlerSeach(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
