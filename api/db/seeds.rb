# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


AppClient.create({
  "name": "service-test",
  "stages": [
    {
      "name": "review",
      "review": true,
      "clusters": [
        {
          "name": "staging",
          "values": {
            "prefix": "review"
          }
        }
      ]
    },
    {
      "name": "staging",
      "promote": true,
      "clusters": [
        {
          "name": "staging",
          "values": {
            "prefix": "staging"
          }
        }
      ]
    },
    {
      "name": "production",
      "promote": true,
      "clusters": [
        {
          "name": "staging",
          "values": {
            "prefix": "staging"
          }
        }
      ]
    }
  ]
})
