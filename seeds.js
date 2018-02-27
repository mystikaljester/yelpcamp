var mongoose    = require('mongoose'),
    Campground  = require('./models/campground')
    Comment     = require('./models/comment');

var data = [
  {
    name: 'Camp Crystal Lake',
    image: 'https://farm5.staticflickr.com/4515/38623504871_32017500e5.jpg',
    description: 'Zombies reversus ab inferno, nam malum cerebro. De carne animata corpora quaeritis. Summus sit​​, morbo vel maleficia? De Apocalypsi undead dictum mauris. Hi mortuis soulless creaturas, imo monstra adventus vultus comedat cerebella viventium. Qui offenderit rapto, terribilem incessu. The voodoo sacerdos suscitat mortuos comedere carnem. Search for solum oculi eorum defunctis cerebro. Nescio an Undead zombies. Sicut malus movie horror.'
  },
  {
    name: 'Camp Wanahakaloogi',
    image: 'https://farm4.staticflickr.com/3002/2386125285_2c05889d2a.jpg',
    description: 'Cum horribilem resurgere de sepulcris creaturis, sicut de iride et serpens. Pestilentia, ipsa screams. Pestilentia est haec ambulabat mortuos. Sicut malus voodoo. Aenean a dolor vulnerum aperire accedunt, mortui iam vivam. Qui tardius moveri, sed in magna copia sint terribiles legionis. Alii missing oculis aliorum sicut serpere crabs nostram. Putridi odores aere implent.'
  },
  {
    name: 'Slob\'s knob',
    image: 'https://farm5.staticflickr.com/4285/35301859822_4d49713574.jpg',
    description: 'Tremor est vivos magna. Expansis ulnis video missing carnem armis caeruleum in locis. A morbo amarus in auras. Nihil horum sagittis tincidunt, gelida portenta. The unleashed virus est, et iam mortui ambulabunt super terram. Souless mortuum oculos attonitos back zombies. An hoc incipere Clairvius Narcisse, an ante? Is bello mundi z?'
  }
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, (err) => {
    if(err) console.log(err);
    else {
      console.log('All campgrounds removed.');
      data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
          if(err) console.log(err);
          else {
            console.log('Campground Created');
            Comment.create(
              {
                text: 'This place is great, but I wish it had internet',
                author: 'Homer'
              }, (err, comment) => {
                if(err) console.log(err);
                else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('Comment created')
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;
