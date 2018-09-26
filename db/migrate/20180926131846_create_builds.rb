class CreateBuilds < ActiveRecord::Migration[5.1]
  def change
    create_table :builds, id: false do |t|
      t.string :id, primary: true
      t.references :app, foreign_key: true
      t.string :stage
      t.string :version
      t.text :values

      t.timestamps
    end
  end
end
