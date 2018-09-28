class CreateBuilds < ActiveRecord::Migration[5.1]
  def change
    create_table :builds do |t|
      t.references :app,     foreign_key: true
      t.references :stage,   foreign_key: true
      t.string     :uid,     unique: true, null: false
      t.string     :version, null: false
      t.text       :values

      t.timestamps
    end
  end
end
