import Baobab from 'baobab';

const tree = new Baobab({
  company_name: Django.company_name,
  subscriber_list_id: Django.subscriber_list_id,
  subscriber_id: Django.subscriber_id,
  receive: false,
  confirmed: Django.confirmed,
});

export default tree;