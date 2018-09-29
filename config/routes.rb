Rails.application.routes.draw do
  root to: 'apps#index'

  resources :apps do
    get  'logs'
    post 'promote'  => 'releases#promote'
    post 'release'  => 'releases#release'
    post 'rollback' => 'releases#rollback'
    post 'remove'   => 'releases#remove'
  end
  get  'events' => 'events#index'

  namespace :api do
    scope :v1 do
      resources :builds, only: [:create]
      resources :apps,   only: [:create, :index, :show], param: :app_uid
    end
  end
end
