class Release < ApplicationRecord
  self.primary_key =  "id"
  belongs_to :build

  subscribe(Releases::CreatedEvent) do |event|
    params = event.params

    Release.create!(
      id: params[:id],
      build: Build.find(params[:build_id]),
      status: 'INITIAL',
    )
  end
end
