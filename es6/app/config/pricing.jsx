const pricing = {
  multilocation: {
    lite: {
      monthly: {
        month: 1,
        charge: 1,
      },
    },
    standard: {
      monthly: {
        month: 299,
        charge: 299,
      },
      // quarterly: {
      //   month: 374,
      //   charge: (374 * 4),
      // },
      // yearly: {
      //   month: 299,
      //   charge: (299 * 12),
      // },
    }, 
  },
  individual: {
    lite: {
      monthly: {
        month: 1,
        charge: 1,
      },
    },
    standard: {
      monthly: {
        month: 99,
        charge: 99,
      },
      // quarterly: {
      //   month: 99,
      //   charge: (99 * 4),
      // },
      // yearly: {
      //   month: 79,
      //   charge: (79 * 12),
      // },
    }, 
  },
  subscriber: {
    lite: {
      monthly: {
        month: 1,
        charge: 1,
      },
    },
  }
}

export default pricing;
