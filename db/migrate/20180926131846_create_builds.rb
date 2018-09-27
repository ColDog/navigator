class CreateBuilds < ActiveRecord::Migration[5.1]
  def change
    create_table :builds do |t|
      t.string     :uid, unique: true, null: false
      t.references :app, foreign_key: true
      t.string     :stage
      t.string     :version
      t.text       :values

      t.timestamps
    end
  end
end
