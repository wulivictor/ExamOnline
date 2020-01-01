export default class LastMayday {
  palette(title,o1,o2,o3,o4) {
    return ({
      width: '654rpx',
      height: '1000rpx',
      background: '#eee',
      views: [
        _textTitle(title),
        _textDecoration(o1, 0),
        _textDecoration(o2, 1),
        _textDecoration(o3, 2),
        _textDecoration(o4, 3),
        _image(2)
      ],
    });
  }
}

const startTop = 140;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '40rpx',
};


function _textTitle(text) {
  return ({
    type: 'text',
    text: text,
    css: [{
      top: '30rpx',
      maxLines: 2,
      width: '650rpx',
    }, common],
  });
}


function _textDecoration(text, index, color) {
  return ({
    type: 'text',
    text: text,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      maxLines: 2,
      width: '650rpx',
      color: color,
    }, common],
  });
}

function _image(index) {
  return (
    {
      type: 'image',
      url: '/qrcode/gh_3e9bb0bede36_344.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        align: 'center',
        width: '175rpx',
        height: '175rpx'
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
