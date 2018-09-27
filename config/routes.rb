Rails.application.routes.draw do
  root to: 'apps#index'
  resources :apps do
    get  'logs'
    post 'promote'  => 'releases#promote'
    post 'release'  => 'releases#release'
    post 'rollback' => 'releases#rollback'
    post 'remove'   => 'releases#remove'
  end

  post 'api/v1/builds' => 'api/builds#create'
end
