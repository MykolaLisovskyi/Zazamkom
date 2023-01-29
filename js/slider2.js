'use strict';
    var multiItemSlider = (function () {

      function _isElementVisible(element) {
        var rect = element.getBoundingClientRect(),
          vWidth = window.innerWidth || doc.documentElement.clientWidth,
          vHeight = window.innerHeight || doc.documentElement.clientHeight,
          elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
        if (rect.right < 0 || rect.bottom < 0
          || rect.left > vWidth || rect.top > vHeight)
          return false;
        return (
          element.contains(elemFromPoint(rect.left, rect.top))
          || element.contains(elemFromPoint(rect.right, rect.top))
          || element.contains(elemFromPoint(rect.right, rect.bottom))
          || element.contains(elemFromPoint(rect.left, rect.bottom))
        );
      }

      return function (selector, config) {
        var
          _mainElement = document.querySelector(selector),
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper2'),
          _sliderItems = _mainElement.querySelectorAll('.slider__item2'),
          _sliderControls = _mainElement.querySelectorAll('.slider__control2'),
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left2'),
          _sliderControlRight = _mainElement.querySelector('.slider__control_right2'),
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
          _html = _mainElement.innerHTML,
          _indexIndicator = 0,
          _maxIndexIndicator = _sliderItems.length - 1,
          _indicatorItems,
          _positionLeftItem = 0,
          _transform = 0,
          _step = _itemWidth / _wrapperWidth * 100,
          _items = [],
          _interval = 0,
          _states = [
            { active: false, minWidth: 0, count: 1 },
            { active: false, minWidth: 576, count: 2 },
            { active: false, minWidth: 992, count: 3 },
            { active: false, minWidth: 1200, count: 4 },
          ],
          _config = {
            isCycling: false,
            direction: 'right',
            interval: 3000,
            pause: true
          };

        for (var key in config) {
          if (key in _config) {
            _config[key] = config[key];
          }
        }

        _sliderItems.forEach(function (item, index) {
          _items.push({ item: item, position: index, transform: 0 });
        });

        var _setActive = function () {
          var _index = 0;
          var width = parseFloat(document.body.clientWidth);
          _states.forEach(function (item, index, arr) {
            _states[index].active = false;
            if (width >= _states[index].minWidth)
              _index = index;
          });
          _states[_index].active = true;
        }

        var _getActive = function () {
          var _index;
          _states.forEach(function (item, index, arr) {
            if (_states[index].active) {
              _index = index;
            }
          });
          return _index;
        }

        var position = {
          getItemMin: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position < _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getItemMax: function () {
            var indexItem = 0;
            _items.forEach(function (item, index) {
              if (item.position > _items[indexItem].position) {
                indexItem = index;
              }
            });
            return indexItem;
          },
          getMin: function () {
            return _items[position.getItemMin()].position;
          },
          getMax: function () {
            return _items[position.getItemMax()].position;
          }
        }

        var _transformItem = function (direction) {
          var nextItem, currentIndicator = _indexIndicator;
          if (!_isElementVisible(_mainElement)) {
            return;
          }
          if (direction === 'right') {
            _positionLeftItem++;
            if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
              nextItem = position.getItemMin();
              _items[nextItem].position = position.getMax() + 1;
              _items[nextItem].transform += _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform -= _step;
            _indexIndicator = _indexIndicator + 1;
            if (_indexIndicator > _maxIndexIndicator) {
              _indexIndicator = 0;
            }
          }
          if (direction === 'left') {
            _positionLeftItem--;
            if (_positionLeftItem < position.getMin()) {
              nextItem = position.getItemMax();
              _items[nextItem].position = position.getMin() - 1;
              _items[nextItem].transform -= _items.length * 100;
              _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
            }
            _transform += _step;
            _indexIndicator = _indexIndicator - 1;
            if (_indexIndicator < 0) {
              _indexIndicator = _maxIndexIndicator;
            }
          }
          _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
          _indicatorItems[currentIndicator].classList.remove('active');
          _indicatorItems[_indexIndicator].classList.add('active');
        }

        var _slideTo = function (to) {
          var i = 0, direction = (to > _indexIndicator) ? 'right' : 'left';
          while (to !== _indexIndicator && i <= _maxIndexIndicator) {
            _transformItem(direction);
            i++;
          }
        }

        var _cycle = function (direction) {
          if (!_config.isCycling) {
            return;
          }
          _interval = setInterval(function () {
            _transformItem(direction);
          }, _config.interval);
        }

        var _controlClick = function (e) {
          if (e.target.classList.contains('slider__control2')) {
            e.preventDefault();
            var direction = e.target.classList.contains('slider__control_right2') ? 'right' : 'left';
            _transformItem(direction);
            clearInterval(_interval);
            _cycle(_config.direction);
          }
          if (e.target.getAttribute('data-slide-to')) {
            e.preventDefault();
            _slideTo(parseInt(e.target.getAttribute('data-slide-to')));
            clearInterval(_interval);
            _cycle(_config.direction);
          }
        };

        var _handleVisibilityChange = function () {
          if (document.visibilityState === "hidden") {
            clearInterval(_interval);
          } else {
            clearInterval(_interval);
            _cycle(_config.direction);
          }
        }

        var _refresh = function () {
          clearInterval(_interval);
          _mainElement.innerHTML = _html;
          _sliderWrapper = _mainElement.querySelector('.slider__wrapper2');
          _sliderItems = _mainElement.querySelectorAll('.slider__item2');
          _sliderControls = _mainElement.querySelectorAll('.slider__control2');
          _sliderControlLeft = _mainElement.querySelector('.slider__control_left2');
          _sliderControlRight = _mainElement.querySelector('.slider__control_right2');
          _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
          _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
          _positionLeftItem = 0;
          _transform = 0;
          _indexIndicator = 0;
          _maxIndexIndicator = _sliderItems.length - 1;
          _step = _itemWidth / _wrapperWidth * 100;
          _items = [];
          _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
          });
          _addIndicators();
        }

        var _setUpListeners = function () {
          _mainElement.addEventListener('click', _controlClick);
          if (_config.pause && _config.isCycling) {
            _mainElement.addEventListener('mouseenter', function () {
              clearInterval(_interval);
            });
            _mainElement.addEventListener('mouseleave', function () {
              clearInterval(_interval);
              _cycle(_config.direction);
            });
          }

          document.addEventListener('visibilitychange', _handleVisibilityChange, false);
          window.addEventListener('resize', function () {
            var
              _index = 0,
              width = parseFloat(document.body.clientWidth);
            _states.forEach(function (item, index, arr) {
              if (width >= _states[index].minWidth)
                _index = index;
            });
            if (_index !== _getActive()) {
              _setActive();
              _refresh();
            }
          });
        }

        var _addIndicators = function () {
          var sliderIndicators = document.createElement('ol');
          sliderIndicators.classList.add('slider__indicators');
          for (var i = 0; i < _sliderItems.length; i++) {
            var sliderIndicatorsItem = document.createElement('li');
            if (i === 0) {
              sliderIndicatorsItem.classList.add('active');
            }
            sliderIndicatorsItem.setAttribute("data-slide-to", i);
            sliderIndicators.appendChild(sliderIndicatorsItem);
          }
          _mainElement.appendChild(sliderIndicators);
          _indicatorItems = _mainElement.querySelectorAll('.slider__indicators > li')
        }

        // добавляем индикаторы
        _addIndicators();
        // инициализация
        _setUpListeners();

        if (document.visibilityState === "visible") {
          _cycle(_config.direction);
        }
        _setActive();

        return {
          right: function () {
            _transformItem('right');
          },
          left: function () {
            _transformItem('left');
          },
          stop: function () {
            _config.isCycling = false;
            clearInterval(_interval);
          },
          cycle: function () {
            _config.isCycling = true;
            clearInterval(_interval);
            _cycle();
          }
        }

      }
    }());

    var slider = multiItemSlider('.sliderKolya2', {
      isCycling: true
    });
