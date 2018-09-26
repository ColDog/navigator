class CreateReleases < ActiveRecord::Migration[5.1]
  def change
    create_table :releases, id: false do |t|
      t.string :id, primary: true
      t.references :build, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
