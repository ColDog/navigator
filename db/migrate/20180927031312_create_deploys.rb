class CreateDeploys < ActiveRecord::Migration[5.1]
  def change
    create_table :deploys do |t|
      t.references :release, foreign_key: true
      t.string     :uid, unique: true, null: false
      t.string     :cluster
      t.string     :status

      t.timestamps
    end
  end
end
