import React from 'react';
import moment from 'moment';
import { configure, addDecorator, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';
import './storybook.scss';

addDecorator((story) => {
  moment.locale('en');
  return (story());
});

// addDecorator(story => (
//   <div>
//     <div
//       style={{
//         background: '#fff',
//         height: 6 * 8,
//         width: '100%',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         padding: '8px 40px 8px 8px',
//         overflow: 'scroll',
//       }}
//     >
//       <span dangerouslySetInnerHTML={{ __html: helperText }} />
//     </div>

//     <div style={{ marginTop: 7 * 8 }}>
//       {story()}
//     </div>
//   </div>
// ));

setOptions({
  name: 'REACT-DATES',
  url: 'https://github.com/airbnb/react-dates',
});

function loadStories() {
  require('../stories/CoreComponents');
}

setAddon(infoAddon);

configure(loadStories, module);
