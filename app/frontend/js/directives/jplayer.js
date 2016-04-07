'use strict';

angular.directive('jplayer', function() {
      return {
        restrict: 'EA',
        template: '<div></div>',
        link: function(scope, element, attrs) {
          var $control = element,
              $player = $control.children('div'),
              cls = 'pause';

          var updatePlayer = function() {
            $player.jPlayer({
              // Flash fallback for outdated browser not supporting HTML5 audio/video tags
              // http://jplayer.org/download/
              swfPath: 'js/jplayer/',
              supplied: 'mp3',
              solution: 'html, flash',
              preload: 'auto',
              wmode: 'window',
              ready: function () {
                $player
                  .jPlayer('setMedia', {mp3: scope.$eval(attrs.audio)})
                  .jPlayer(attrs.autoplay === 'true' ? 'play' : 'stop');
              },
              play: function() {
                $control.addClass(cls);

                if (attrs.pauseothers === 'true') {
                  $player.jPlayer('pauseOthers');
                }
              },
              pause: function() {
                $control.removeClass(cls);
              },
              stop: function() {
                $control.removeClass(cls);
              },
              ended: function() {
                $control.removeClass(cls);
              }
            })
            .end()
            .unbind('click').click(function() {
              $player.jPlayer($control.hasClass(cls) ? 'stop' : 'play');
            });
          };

          scope.$watch(attrs.audio, updatePlayer);
          updatePlayer();
        }
      };
 });
