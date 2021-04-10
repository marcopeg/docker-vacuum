const rules1 = [
  { match: 'registry.24hr(.*)', retain: 1 },
  { match: 'mariadb', retain: 1 },
  { match: 'marcopeg/gatsby-deploy', retain: 2 },
];

const matches1 = [
  {
    repository: 'marcopeg/gatsby-deploy',
    retain: 2,
    images: [
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: '0.0.6',
        uuid: 'e70dc25e930b',
        digest:
          'sha256:c2830bfb3eb76270da0bc5a4c4282e3620ca414e4d2de72f17607c215237b689',
        lifetime: '5 days ago',
        ctime: {
          string: '2019-03-21 07:59:42 +0100 CET',
          date: new Date('2019-03-21T07:59:42.000Z'),
        },
        size: {
          string: '944MB',
          bytes: 989855744,
        },
      },
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: 'latest',
        uuid: 'e70dc25e930b',
        digest:
          'sha256:c2830bfb3eb76270da0bc5a4c4282e3620ca414e4d2de72f17607c215237b689',
        lifetime: '5 days ago',
        ctime: {
          string: '2019-03-21 07:59:42 +0100 CET',
          date: new Date('2019-03-21T07:59:42.000Z'),
        },
        size: { string: '944MB', bytes: 989855744 },
      },
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: '0.0.5',
        uuid: '2e3e35c7f05e',
        digest:
          'sha256:57885b608f42431b890205a2573aaf229f012601e5bf34601408490e85453078',
        lifetime: '5 days ago',
        ctime: {
          string: '2019-03-21 07:43:55 +0100 CET',
          date: new Date('2019-03-21T07:43:55.000Z'),
        },
        size: { string: '944MB', bytes: 989855744 },
      },
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: '0.0.4',
        uuid: '46f147e02b2d',
        digest:
          'sha256:0b89872189e106dc423d13906b9e6c98e34fb986205a27a87169d4cd91f1d15c',
        lifetime: '8 days ago',
        ctime: {
          string: '2019-03-18 09:35:13 +0100 CET',
          date: new Date('2019-03-18T09:35:13.000Z'),
        },
        size: { string: '944MB', bytes: 989855744 },
      },
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: '0.0.2',
        uuid: '60f7a4e47209',
        digest:
          'sha256:0b20aca18606c882f9e4dec42bbfa4cb83d9828ecfbbcdf518dbfa34851d0a8d',
        lifetime: '9 days ago',
        ctime: {
          string: '2019-03-16 20:48:11 +0100 CET',
          date: new Date('2019-03-16T20:48:11.000Z'),
        },
        size: { string: '944MB', bytes: 989855744 },
      },
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: '0.0.1',
        uuid: 'd358bfcfa658',
        digest:
          'sha256:d4f34cec3d7bcb779215c4658be79ef0e50e688f140e9608f3535db8af9cb1f3',
        lifetime: '9 days ago',
        ctime: {
          string: '2019-03-16 19:15:20 +0100 CET',
          date: new Date('2019-03-16T19:15:20.000Z'),
        },
        size: { string: '143MB', bytes: 149946368 },
      },
      {
        repository: 'marcopeg/gatsby-deploy',
        tag: '0.0.0',
        uuid: '43a6c8ee8825',
        digest:
          'sha256:c1f742cf146836c7cebc2f628c7ce40ab0b1f7167eff5f41e0ac8bd36f440f78',
        lifetime: '9 days ago',
        ctime: {
          string: '2019-03-16 17:47:36 +0100 CET',
          date: new Date('2019-03-16T17:47:36.000Z'),
        },
        size: { string: '143MB', bytes: 149946368 },
      },
    ],
  },
];

module.exports = { rules1, matches1 };
